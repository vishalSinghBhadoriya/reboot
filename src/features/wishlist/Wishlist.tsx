import {Action,Heading} from '../../components/ui'
import {getProduct} from '../../data/products'
import {useShop} from '../../stores/useShop'
import ProductCard from '../products/ProductCard'
export default function Wishlist(){
 const ids=useShop(s=>s.wishlist)
 return <div className="light"><div className="content"><Heading label="WISHLIST" title="Saved for later.">Your favourites are saved on this device.</Heading>{ids.length?<div className="product-grid">{ids.map(id=><ProductCard key={id} p={getProduct(id)!} move/>)}</div>:<div className="panel stack"><h2>Your wishlist is empty.</h2><Action to="/shop">Find your next upgrade</Action></div>}</div></div>
}
