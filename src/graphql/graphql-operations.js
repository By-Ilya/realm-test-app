import gql from 'graphql-tag';

export const FIND_PROJECTS = gql`
    query FindProjectsCustomResolver($filtersInput: PsprojectsFiltersInput!) {
        psprojectsData(input: $filtersInput) {
            _id
            account
            account_id
            active
            monthly_forecast_done
            details {
                pm_stage
                on_hold_reason
                pm_project_status
                product_end_date
            }
            opportunity {
                name
                owner
                engagement_manager
                _id
            }
            summary {
                backlog_hours
                gap_hours
                planned_hours
            }
            milestones {
                _id
                country
                currency
                name
                custom_name
                summary {
                    planned_hours
                    sold_hours
                    delivered_hours
                    gap_hours
                    unscheduled_hours
                    billable_hours_submitted
                    non_billable_hours_submitted
                    billable_hours_in_financials
                    billable_hours_scheduled_undelivered
                }
                details {
                    first_scheduled_date
                    last_scheduled_date
                    bill_rate
                    milestone_amount
                    delivered_amount
                }
            }
            documents {
                _id
                name
                url
                url_name
            }
            name
            custom_name
            owner
            project_manager
            region
            stage
            survey_sent
            contacts {
                customer {
                    name
                    email
                }
                ce {
                    name
                    email
                }
            }
            future_assignments_dates {
                s
                e
            }
            survey_responses {
              date
              email
              name
              projectId
              survey
              questions {
                score
                score_value
                text
              }
            }
        }
    }
`;

export const FIND_OPPORTUNITIES = gql`
    query FindOpportunitiesCustomResolver($filtersInput: OpportunitiesFiltersInput!) {
        opportunitiesData(input: $filtersInput) {
            _id
            account
            account_id
            amount
            close_date
            em {
                call
                call_amount
                engagement_manager
                esd_created
                ps_status
            }
            forecast_category
            has_services
            name
            owner
            owner_region
            ps_notes
            ps_region
            services_post_carve
            stage
        }
    }
`;
