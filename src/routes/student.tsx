import { Route } from 'react-router-dom'
import Layout from '../shared/layout/Layout'

function Page({ title }: { title: string }) {
  return (
    <Layout>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">Page content</p>
    </Layout>
  )
}

export default function StudentRoutes() {
  return (
    <>
     
    </>
  )
}