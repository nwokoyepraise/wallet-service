import * as argon2 from "argon2";

export class TokenHandler {
  static async hashKey(password: string) : Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      /* istanbul ignore next */
      console.error(error);
    }
  }

  static async verifyKey(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain)
  } catch (error) {
    /* istanbul ignore next */
      console.log(error);
  }
  }
}
