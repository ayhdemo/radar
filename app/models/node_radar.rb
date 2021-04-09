class NodeRadar
	include ActiveGraph::Node

	property :title

	has_many :out, :node_sigs , rel_class: :RelOwn
end