module ElasticsearchService
  # delegate_missing_to :@internal_client
  delegate :search, to: :es_client

  def es_client
    @internal_client ||= Elasticsearch::Client.new(Rails.application.credentials.elasticsearch)
  end

  def es_dsl(&block)
    if @query_builder.nil?
      annonymous_class = Class.new do
        include Elasticsearch::DSL
      end
      @query_builder = annonymous_class.new
    end
    @query_builder.instance_eval(&block)
  end
end
