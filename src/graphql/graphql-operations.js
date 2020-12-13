import gql from 'graphql-tag'

export const FIND_PROJECTS = gql`
    query FindProjectsCustomResolver($filtersInput: FiltersInput!) {
        psprojectsData(input: $filtersInput) {
            _id
            account
            account_id
            active
            monthly_forecast_done
            details {
                pm_stage
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
                summary {
                    planned_hours
                    sold_hours
                    delivered_hours
                    gap_hours
                    unscheduled_hours
                }
                details {
                    first_scheduled_date
                    last_scheduled_date
                    bill_rate
                    milestone_amount
                    delivered_amount
                }
            }
            name
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
        }
    }
`;