export const Cryptor = jest.fn().mockReturnValue({
  encrypt: (text: string) =>
    `ENCRYPTED||ENCRYPTED||${text}||ENCRYPTED||ENCRYPTED`,
  decrypt: (text: string) => text.split('||')[2],
});
