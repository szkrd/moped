// constants defined in mpd src/protocol/Ack.hxx.
export enum Ack {
  AckErrorNotList = 1,
  AckErrorArg = 2,
  AckErrorPassword = 3,
  AckErrorPermission = 4,
  AckErrorUnknown = 5,

  AckErrorNoExist = 50,
  AckErrorPlaylistMax = 51,
  AckErrorSystem = 52,
  AckErrorPlaylistLoad = 53,
  AckErrorUpdateAlready = 54,
  AckErrorPlayerSync = 55,
  AckErrorExist = 56,

  Unknown = 999,
}

// message format: `ACK [error@command_listNum] {current_command} message_text`
export interface IMpdError {
  /** numeric value of one of the ACK_ERROR */
  error: Ack;
  /** offset of the command that caused the error in a Command List. An error will always cause a command list to terminate at the command that causes the error. */
  commandListNum: number;
  /** Name of the command, in a Command List, that was executing when the error occurred. */
  currentCommand: string;
  /** some (hopefully) informative text that describes the nature of the error. */
  messageText: string;
  /** the original unprocessed error response */
  rawMessage: string;
}
