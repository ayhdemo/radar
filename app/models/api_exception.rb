class APIException < Exception
end

[
    {
        code: 1001,
        type: 'invalid parameters',
        klass: 'InvalidParametersError'
    },
    {
        code: 2001,
        type: 'record not exists',
        klass: 'RecordNotExistsError'
    },
    {
        code: 2002,
        type: 'already bind to eth address',
        klass: 'AlreadyBindToEthError'
    },
    {
        code: 2003,
        type: 'eth address exhausted',
        klass: 'EthAddressExhaustedError'
    },
    {
        code: 2004,
        type: 'address pool exhausted',
        klass: 'AddressPoolExhaustedError'
    },
    {
        code: 2005,
        type: 'address invalid',
        klass: 'AddressInvalidError'
    },
    {
        code: 2006,
        type: 'already bind to erc20 address',
        klass: 'AlreadyBindToErc20Error'
    },
    {
        code: 2007,
        type: 'already bind to btc address',
        klass: 'AlreadyBindToBtcError'
    },
    {
        code: 2008,
        type: 'already bind to omni address',
        klass: 'AlreadyBindToOmniError'
    },
    {
        code: 2009,
        type: 'account_id not bind',
        klass: 'AccountIdNotBindError'
    },
    {
        code: 3001,
        type: 'pfc withdraw failed',
        klass: 'PfcWithdrawError'
    },
    {
        code: 3002,
        type: 'panda withdraw failed',
        klass: 'PandaWithdrawError'
    },
    {
        code: 5001,
        type: 'unknown address type',
        klass: 'UnknownAddressTypeError'
    },
    {
        code: 9001,
        type: 'forbidden',
        klass: 'ForbiddenError'
    },
    {
        code: 9101,
        type: 'server fault',
        klass: 'ServerFaultError'
    },
].each {|ele|
  klass = Class.new(APIException) {
    define_method(:initialize) { |*reason|
      unless reason.nil? or reason.to_s.empty?
        ele[:reason] = reason.join(',')
      end
    }
    define_method(:code) {
      ele[:code]
    }
    define_method(:type) {
      ele[:type]
    }
    define_method(:to_s) {
      [[ele[:code]], ele[:type]].join(' ')
    }
    define_method(:to_err_hash) {
      {
          code: ele[:code],
          msg:  [self.type, ele[:reason]].join('. ')
      }
    }
  }
  Object.const_set(ele[:klass], klass)
}