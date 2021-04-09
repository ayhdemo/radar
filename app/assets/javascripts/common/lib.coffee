mylib = window.mylib = window.mylib || {}

# 非空判定（长度>0）
not_empty = (val)->
  val && val.toString().length > 0
# assert fn
my_assert = (fn, val, fulfilled_ret, unfulfilled_ret = '') ->
  if (typeof fn == 'function' && fn(val))
    fulfilled_ret
  else
    unfulfilled_ret

mylib.compactString = (str, length = 12) ->
  return '' unless str && str.length

  if str.length <= length
    return str
  _l = length / 2
  str.substr(0, _l) + '...' + str.substr(-_l, _l)

mylib.dateConvert = (date) ->
  return '' unless date && date.length > 0

  if /utc/gi.test(date)     # UTC time
    moment(new Date(date)).format('YY/MM/DD HH:mm:ss')
  else
    moment(date + '-0000').format('YY/MM/DD HH:mm:ss') || ''

mylib.process_status = (status) ->
  process_status = process_status_map[trx_pair_name]
  my_status = process_status && process_status[+status]
  if my_status
    my_status
  else
    '(unknown)'

get_domain = (chain_type) ->
  switch chain_type
    when 'bts'   then 'https://bts.ai'
    when 'seer'  then 'https://seer.best'
    when 'erc20', 'eth' then 'https://etherscan.io'
    when 'omni', 'btc'  then 'https://live.blockcypher.com/btc'
#    else console.warn("无法查询#{chain_type}的浏览器")

mylib.block_url_template = (block_num, chain_type='bts') ->
  domain  = get_domain(chain_type)
  url     = my_assert(not_empty, block_num, "#{domain}/block/#{block_num}")
  if domain and url then "<a target='_blank' href='#{url}'>#{block_num}</a>" else block_num

mylib.tx_url_template = (tx_id, chain_type='bts', compact=true) ->
  return tx_id unless not_empty(tx_id)
  compacted = if compact then mylib.compactString(tx_id, 8) else tx_id

  switch chain_type
    when 'bts'
      base_url = 'https://bts.ai/tx/'
    when 'erc20', 'eth'
      base_url = 'https://etherscan.io/tx/'
    when 'omni', 'btc'
      base_url = 'https://live.blockcypher.com/btc/tx/'
    else
#      console.warn("无法查询#{chain_type}的浏览器")
      return "<span title='#{tx_id}'>#{compacted}</span>"

  return "<a target='_blank' title='#{tx_id}' href='#{base_url + tx_id}'>#{compacted}</a>"

mylib.account_url_template = (account_id_or_name, chain_type='bts', compact=true) ->
  return account_id_or_name unless not_empty(account_id_or_name)

  switch chain_type
    when 'bts'
      base_url = 'https://bts.ai/u/'
    when 'seer'
      base_url = 'https://wallet.seer.best/account/'
    when 'erc20', 'eth'
      base_url = 'https://etherscan.io/address/'
    when 'omni', 'btc'
      base_url = 'https://live.blockcypher.com/btc/address/'
    else
#      console.warn("无法查询#{chain_type}的浏览器")
      return account_id_or_name

  return "<a target='_blank' href='#{base_url + account_id_or_name}'>#{account_id_or_name}</a>"

mylib.asset_amount = (asset_id, amount) ->
  asset_id = asset_id.toString()
  power = asset_power(asset_id)
  if power
    power = Math.pow(10, power)
    amount_arr = (amount / power).toString().split('.')
    amount_real = amount_arr[0]
    amount_dot  = amount_arr[1] && amount_arr[1].slice(0, 5) || ''
    amount_dot  = amount_dot.replace(/0+$/g, '');     # remove tailing zeros
    return amount_real unless amount_dot.length
    amount_float = [amount_real, amount_dot].join('.')
  else
    amount + '(错误)'

mylib.set_trx_pair = (pair) ->
  if pair
    trx_pair_name = pair