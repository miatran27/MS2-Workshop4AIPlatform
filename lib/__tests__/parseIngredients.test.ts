import { parseIngredientsFromModel } from '../parseIngredients';

describe('parseIngredientsFromModel', () => {
  it('parses a simple JSON array of strings', () => {
    const out = parseIngredientsFromModel('["tomato", "onion", "garlic"]');
    expect(out).toEqual([
      { name: 'tomato', confidence: undefined },
      { name: 'onion', confidence: undefined },
      { name: 'garlic', confidence: undefined },
    ]);
  });

  it('parses array of objects with name and confidence', () => {
    const out = parseIngredientsFromModel(
      '[{"name":"olive oil","confidence":0.9},{"name":"pasta","confidence":0.85}]'
    );
    expect(out).toEqual([
      { name: 'olive oil', confidence: 0.9 },
      { name: 'pasta', confidence: 0.85 },
    ]);
  });

  it('strips markdown code block and parses', () => {
    const out = parseIngredientsFromModel('```json\n["a","b"]\n```');
    expect(out).toEqual([
      { name: 'a', confidence: undefined },
      { name: 'b', confidence: undefined },
    ]);
  });

  it('extracts array from surrounding text', () => {
    const out = parseIngredientsFromModel('Here are the ingredients: ["x","y"]');
    expect(out).toEqual([
      { name: 'x', confidence: undefined },
      { name: 'y', confidence: undefined },
    ]);
  });

  it('returns empty array for invalid JSON when fallback has no list', () => {
    const out = parseIngredientsFromModel('no json here');
    expect(out).toEqual([]);
  });

  it('filters out empty names', () => {
    const out = parseIngredientsFromModel('["ok", "", "  ", "also"]');
    expect(out).toEqual([
      { name: 'ok', confidence: undefined },
      { name: 'also', confidence: undefined },
    ]);
  });
});
