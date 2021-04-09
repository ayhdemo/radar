module Api
  module V2
    class ATplBase < ActionController::Base

      ## 模板A ：简单版
      ## 目前服务于 石墨烯 <--> ETH ; 石墨烯 <--> OMNI
      ## account 通常值得是 石墨烯账号； address 通常是 ETH BTC地址
     
      attr_reader :address, :account_id,:account_name

      before_action :check_params, only: [:query,:bind]
      before_action :find_map, only: [:query]

      def initialize(_project,_account_type,_address_type,_address_chain)
        super()  
        @project = _project
        @account_type = _account_type
        @address_type = _address_type
        @address_chain = _address_chain
        
      end

      def query
        if @map.nil?
          render :json => {
              "code": 9001,
              "msg":  "invalid access"
          }
        else
          render_record_json
        end
      end

      def bind
        return render :json => {
            "code":   9001,
            "msg":    "invalid access"
        } if account_name.nil? or account_id.nil?

        @map = BindMap.where('account_type=? and address_type=? and (account_name=? or account_id=?)',@account_type,@address_type,account_name,account_id).limit(1).first

        return render :json => {
            "code":   2002,
            "msg":    "account_name or account_id already exists"
        } unless @map.nil?

        BindMap.transaction do 
          @map = BindMap.lock.where(project:@project, address_chain:@address_chain,account_name:nil, account_id:nil).limit(1).first
          unless @map
            render :json => {
              "code":  2003,
              "msg":   "#{@address_type}地址不足",
              "data":  nil
            }
            return $app_logger.error(self, "#{@address_type}地址不足, request info: [#{@account_id}:#{@account_name}]")
          end

          @map.update!(:account_type => @account_type, :account_id => account_id, :account_name => account_name,:address_type=>@address_type)
        end

        render_record_json
      end


      private
      def account_param(param_name)
        params["#{@account_type}_#{param_name}"]
      end

      def address_param(param_name)
        params["#{@address_type}_#{param_name}"]
      end

      def find_map
        @account_name
        return @map  = nil if address.nil? && account_id.nil? && account_name.nil?

        # 避开SQL注入风险
        condition = {}
        condition[:address] = address if address
        condition[:account_id] = account_id if account_id
        condition[:account_name] = account_name if account_name

        @map = BindMap.where(account_type:@account_type,address_type:@address_type, project:@project).where(condition).limit(1).first

      end

      def collect_record_columns
        {
            "#{@address_type}_address":          @map.address,
            "#{@account_type}_account_id":       @map.account_id,
            "#{@account_type}_account_name":     @map.account_name,
        }
      end

      def render_record_json
        render :json => {
            "code": 0,
            "msg":  "ok",
            "data": collect_record_columns
        }
      end

      def check_params()
        @address      = address_param('address')
        @account_id   = account_param('account_id')
        @account_name = account_param('account_name')

        unless is_legal(address) && is_legal(account_id) && is_legal(account_name)
          render :json =>{
            "code": 9002,
            "msg": "invalid params"
          }
        end
      end

      def is_legal(content)  ## 经测试,nil可以通过； "" 不可以通过 ；带空格不可以通过
        if content  ## 存在  
          if content =~ /^[\.A-Za-z0-9-]+$/   ## OK
            return true
          else
            return false
          end

        else
          true
        end
      end


    end
  end
end
