import { NavBar } from "../ui/NavBar";

export default function HomeLayout({children}:{children : React.ReactNode}){
    return (
        <div>
            <NavBar />
            {children}
        </div>
    )
}