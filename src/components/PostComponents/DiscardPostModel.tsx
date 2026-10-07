



export default function DiscardPostModel(){
    return(
        <div className="bg-primary9 rounded-lg p-3 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-1 text-center">
                <h3 className="text-grey1 text-3xl">Discard post?</h3>
                <p className="text-grey4 text-[1.1rem]">If you leave, your edits wont't be saved.</p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
                <button className="text-error4 hover:brightness-110 border-y border-y-grey4 cursor-pointer text-[1.2rem]">Discard</button>
                <button className="text-grey1 hover:brightness-110 border-y border-y-grey4 cursor-pointer text-[1.2rem]">Cancel</button>
            </div>
        </div>
    )
}