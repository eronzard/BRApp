export const getScriptureDetails = async (
  reference: string,
  version: string
): Promise<{ text: string; fullReference: string }> => {
  try {
    const params = new URLSearchParams({ reference, version });
    const response = await fetch(`/api/bible?${params.toString()}`);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text ?? '',
      fullReference: data.fullReference ?? reference,
    };
  } catch (error) {
    console.error('bibleService error:', error);
    return { text: 'Error retrieving scripture text.', fullReference: reference };
  }
};
