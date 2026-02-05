import type pg from 'pg';
import type { SuggestionComment } from './tracker.js';

export interface PollCategory {
  name: string;
  description: string;
  suggestions: string[]; // tweet IDs
  totalLikes: number;
}

export class SuggestionCategorizer {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async categorize(pool: pg.Pool): Promise<PollCategory[]> {
    const result = await pool.query(
      `SELECT tweet_id, author_handle, content, like_count
       FROM suggestion_comments
       ORDER BY like_count DESC`
    );

    const suggestions = result.rows as SuggestionComment[];

    if (suggestions.length === 0) {
      throw new Error('No suggestions to categorize');
    }

    const suggestionList = suggestions
      .map((s, i) => `${i + 1}. @${s.author_handle} (${s.like_count} likes): "${s.content}"`)
      .join('\n');

    const prompt = `You are analyzing community suggestions for what type of DeFi protocol to build.

Here are all the suggestions:
${suggestionList}

Analyze these suggestions and group them into exactly 4 categories for a poll. Each category should:
1. Have a short name (1-3 words, like "DEX", "Lending Protocol", "Perpetuals", "Bridge", "Yield Aggregator", etc.)
2. Have a brief description (1 sentence)
3. Include the suggestion numbers that fit this category

Some suggestions may be spam, jokes, or off-topic - exclude those from all categories.

Respond with ONLY valid JSON in this exact format:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Brief description of this protocol type",
      "suggestionNumbers": [1, 3, 5]
    }
  ]
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse categorization response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const categories: PollCategory[] = parsed.categories.map(
      (cat: { name: string; description: string; suggestionNumbers: number[] }) => {
        const catSuggestions = cat.suggestionNumbers
          .filter((n: number) => n > 0 && n <= suggestions.length)
          .map((n: number) => suggestions[n - 1]);

        return {
          name: cat.name,
          description: cat.description,
          suggestions: catSuggestions.map((s: SuggestionComment) => s.tweet_id),
          totalLikes: catSuggestions.reduce((sum: number, s: SuggestionComment) => sum + s.like_count, 0),
        };
      }
    );

    for (const category of categories) {
      for (const tweetId of category.suggestions) {
        await pool.query(
          'UPDATE suggestion_comments SET category = $1 WHERE tweet_id = $2',
          [category.name, tweetId]
        );
      }
    }

    return categories;
  }

  formatPollOptions(categories: PollCategory[]): string[] {
    return categories.map((cat) => {
      const name = cat.name.slice(0, 22);
      return name.length < cat.name.length ? name + '...' : name;
    });
  }
}
