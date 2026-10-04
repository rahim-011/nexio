


interface OverlayProps{
    closeModel : () => void,
}

export default function Overlay({closeModel}:OverlayProps) {
    return (
        <div className="fixed inset-0 bg-primary7/60 z-45 flex items-center justify-center" onClick={()=>closeModel()}>
        </div>
    )
}
