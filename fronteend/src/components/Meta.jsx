import { Helmet } from "react-helmet-async"



const Meta = ({title, description, keywords}) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
    </div>
  )
}

Meta.defaultProps = {
  title: "Welcome to Proshop",
  description: "We sell the best products for cheap",
  keywords: 'electronics'

}

export default Meta
