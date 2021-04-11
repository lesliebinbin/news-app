class ResultsController < ApplicationController
  def index
    search_index = params[:index] || 'news'
    search_definition = es_dsl do
      search do
        size 0
        source 'aggregations'
        query do
          bool do
            must do
              match_phrase :text do
                query 'scott morrison'
                slop 0
              end
            end
            filter do
              range :timestamp do
                gte 1_551_358_800_000
                # lte 1_554_037_199_999
              end
            end
          end
        end
        aggregation :first_agg do
          date_histogram field: 'timestamp', calendar_interval: '1d' do
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
end
