import gql from 'graphql-tag'

export const FIND_PROJECTS = gql`
query FindProject($query: PsprojectQueryInput!, $sortBy: PsprojectSortByInput!) {
  psprojects(query: $query, sortBy: $sortBy) {
    _id
    account
    active
    details {
      pm_stage
      pm_project_status
      product_end_date
    }
    opportunity {
      name
      owner
      engagement_manager
    }
    milestones {
      _id
      country
      currency
      name
      base {
        milestone_amount
        gap_hours
      }
      schedule {
        week
        revenue
        hours
      }
    }
    name
    owner
    project_manager
    region
    stage
  }
}
`;

export const UPDATE_PROJECT = gql`
    mutation UpdateProject($query: PsprojectQueryInput!, $set: PsprojectUpdateInput!) {
        updateOnePsproject(query: $query, set: $set) {
            _id
        }
    }
`;