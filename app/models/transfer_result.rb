class TransferResult < CommandResult
  def initialize(trx_id, trx_sig, out_nonce='', error=nil)
    @data = {
        nonce:    out_nonce,
        trx_id:   trx_id,
        trx_sig:  trx_sig,
    }

    @error = error
  end
end