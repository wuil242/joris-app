
export default class CustumError extends Error {
  
  /**
   * creer un message d'erreur personaliser
   * 
   * @param {string} msg message d'erreur
   * @param {any[]} args arguments a passer au message
   */
  static create(msg, ...args) {
    for (let i = 0; i < args.length; i++) {
      const element = args[i];
      msg = msg.replace(`$${i}`, element)
    }
    throw new Error(msg)
  }
}