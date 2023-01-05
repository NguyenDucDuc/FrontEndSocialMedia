import { useEffect } from "react"



export const Test = () => {
    console.log('OUT SIDE')
    useEffect(() => {
        console.log('IN SIDE USEEFFECT')
    }, [])
    return (
        <>
            {console.log('JSX')}
            <div>
                <h1>TEST</h1>

            </div>
        </>
    )
}