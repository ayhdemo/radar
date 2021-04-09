class Detection < ApplicationRecord

	belongs_to  :sig
  belongs_to  :sim_sig, class_name: 'Sig', foreign_key: :sim_sig_id
end