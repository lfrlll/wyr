export function countChineseChars(text: string): number {
  const chinese = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const words = text.match(/[A-Za-z]+/g)?.length ?? 0;
  const numbers = text.match(/\d+/g)?.length ?? 0;
  return chinese + words + numbers;
}
