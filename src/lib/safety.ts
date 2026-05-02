const unsafePatterns = [
  /未成年[\s\S]{0,30}(成人亲密|性|做爱|上床|肉|瑟|H|开车)/i,
  /(强奸|迷奸|胁迫|非自愿)[\s\S]{0,30}(浪漫|美化|甜|刺激|亲密|关系)/i,
  /(美化|合理化)[\s\S]{0,30}(伤害|控制|胁迫|非自愿)/i
];

export function assertSafeNovelInput(text: string) {
  if (unsafePatterns.some((pattern) => pattern.test(text))) {
    throw new Error("这个输入包含不适合生成的亲密或伤害内容。可以改成成年人、自愿、平等、尊重边界的情感表达，或把校园/未成年角色改为清水、暗恋、陪伴与成长。");
  }
}
