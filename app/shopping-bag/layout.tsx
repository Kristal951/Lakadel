import Header from "@/components/shop/Header";
import TopBar from "@/components/shop/TopBar";

export default function ShoppingBagLayout({children}: {
  children: React.ReactNode;
}){
    return(
        <div className="flex-1 w-full mt-30">
            <Header/>
            <TopBar/>
            {children}
        </div>
    )
}