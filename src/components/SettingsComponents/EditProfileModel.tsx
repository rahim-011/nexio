import ChangePfp from "../ProfileComponents/ChangePfp";




export default function EditProfileModel(){
    return(
        <div className="bg-primary9 rounded-lg p-4 fixed">
            <h1 className="text-grey1 text-2xl">Edit Profile</h1>
            <ChangePfp/>
            
        </div>
    )
}