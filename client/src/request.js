import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-boost';
import gql from 'graphql-tag'
const endpointURL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
    link: new HttpLink({uri: endpointURL}),
    cache: new InMemoryCache(),
    defaultOptions: {watchQuery: {
        fetchPolicy: 'cache-and-network',
      }}
});
export async function loadJobs() {
   const query = gql`
                query {
                    jobs {
                    id,
                    title,
                    company {
                        id,
                        name,
                        description
                    }
                    } 
                }                
                `;
    const {data: {jobs}} = await client.query({query});                
    return jobs;
}


export async function loadJobsById(id) {
    const query =gql`
        query JobQuery($id: ID!) { job(id: $id){
                 id,
                 title,
                 description,
                 company{
                   id,
                   name
                 }
               }
             }              
                 `;
    // const {job} = await graphqlRequest(query,{id});
     const {data: {job}} = await client.query({query, variables:{id}});
     
     return job;
 }


 export async function graphqlRequest(query, variables={}) {
    const response = await fetch(endpointURL, {
         method: 'POST',
         headers: {
             'content-type': 'application/json'   
         },
         body: JSON.stringify({query,variables})
     });
     const responseBody = await response.json();
     if(responseBody.errors) {
          throw new Error(responseBody.errors.map((error)=>error.message).join("\n"));
     }
     return responseBody.data;
 }

 export async function loadCompany(id) {
     console.log('company called');
     
     const query = gql`query companyQuery($id: ID!){
        company(id: $id) {
          id,
          name,
          description
          jobs {
              id,
              title
          }
        }
      }`;
     // const {company} = await graphqlRequest(query, {id});
      const {data: {company}} = await client.query({query, variables:{id}});
      return company;
 }
 export async function postJob(companyId, title, description) {
     console.log('post job called');
     
    const mutation = `mutation ($id:ID, $title: String, $description: String) {
        createJob(companyId: $id, title: $title, description: $description)
      }`;
      const id = await graphqlRequest(mutation, {id:companyId, title, description});
      console.log('job posted', id);
      
      return id;
 }