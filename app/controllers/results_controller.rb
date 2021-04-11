class ResultsController < ApplicationController
  def index
    query_words, before_timestamp, after_timestamp, interval = search_params
    search_index = params[:index] || 'news'
    slop_params = params[:slop] || 0
    search_definition = es_dsl do
      search do
        size 0
        source 'aggregations'
        query do
          bool do
            must do
              match_phrase :text do
                query query_words
                slop slop_params
              end
            end
            filter do
              range :timestamp do
                gte after_timestamp
                lte before_timestamp
              end
            end
          end
        end
        aggregation :first_agg do
          date_histogram field: 'timestamp', calendar_interval: interval do
            aggregation :second_agg do
              terms field: 'medium', show_term_doc_count_error: false
            end
          end
        end
      end
    end
    results = search index: search_index, body: search_definition, pretty: true, filter_path: 'aggregations'
    render json: results
  end

  private

  def search_params
    params.require(%i[query before after interval])
  end
end
