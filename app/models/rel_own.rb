class RelOwn
	include ActiveGraph::Relationship

	from_class :NodeRadar
	to_class :NodeSig

	property :notes
end