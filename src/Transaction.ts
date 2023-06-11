import mongoose, { ClientSession } from 'mongoose'

type Sessions = { [user_id: string]: ClientSession | undefined }

const isTransientTransactionError = (error?: any): boolean => {
  // eslint-disable-next-line no-prototype-builtins
  return error?.hasOwnProperty('errorLabels') && error.errorLabels.includes('TransientTransactionError')
}
const isUnknownTransactionCommitResult = (error?: any): boolean => {
  // eslint-disable-next-line no-prototype-builtins
  return error?.hasOwnProperty('errorLabels') && error.errorLabels.includes('UnknownTransactionCommitResult')
}

/**
 * Note*:
 */
export class Transaction {
  private sessions: Sessions = {}
  runTransaction = async (id: string, txnFunc: (session: ClientSession) => Promise<any>) => {
    const _session = await mongoose.startSession()
    this.sessions[id] = _session
    const session = _session
    do {
      try {
        session.startTransaction()
        await txnFunc(session)
        await session.commitTransaction()
        await session.endSession()
        delete this.sessions[id]
        break
      } catch (error: any) {
        // console.log('CATCH', { userId: id, error })
        if (isTransientTransactionError(error) || isUnknownTransactionCommitResult(error) || !session.inTransaction()) {
          // have to check abort by operation (not yet), and abort by the soonest committer to others in queues
          // retry
          continue
        } else {
          await session.abortTransaction()
          await session.endSession()
          delete this.sessions[id]
          throw error
        }
      }
      // eslint-disable-next-line no-constant-condition
    } while (true)
  }
  getSession = (id: string) => this.sessions[id]
}
