---
to: ./pages/<%= path %>/<%= name %>.tsx
force: true
---
import React, { ReactElement } from 'react'
const <%= h.capitalize(name) %> = () => {
  return (
    <div>
      yo!!
    </div>
  );
}

<%= h.capitalize(name) %>.getLayout = function getLayout(page: ReactElement) {
    return (
        <div>
            {page}
        </div>
    )
}

/*

Statically Page Data Fetching
export async function getStaticProps(context) {
   return {
     props: {} // will be passed to the page component as props
   }
 }

Server-Side Page Data Fetching
export async function getServerSideProps(context) {
   return {
     props: {} // will be passed to the page component as props
   }
 }
 
 */

export default <%= h.capitalize(name) %>;


