import avatar from "../../assets/profile/profile avatar.png";
import change_password from "../../assets/profile/change-password-svg.svg";
import save_changes from "../../assets/profile/save-changes-svg.svg";

export default function Profile() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-beige p-6">
      {/* Profile Card */}
      <div className="w-[1124px] h-[744px] bg-red rounded-2xl p-12 flex flex-col">
        {/* Top Section: Image & Profile Info */}
        <div className="flex items-center gap-8">
          {/* Profile Image */}
          <div className="relative w-32 h-32">
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col flex-1">
            <h2 className="text-beige text-4xl font-semibold">My Profile</h2>
            <div className="grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-4 mt-4 flex">
              <input
                type="text"
                placeholder="John"
                className="flex-1 bg-transparent border-3 border-beige text-beige p-4 rounded-xl placeholder-beige"
              />
              <input
                type="text"
                placeholder="Doe"
                className="flex-1 bg-transparent border-3 border-beige text-beige p-4 rounded-xl placeholder-beige"
              />
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="flex-1 bg-transparent border-3 border-beige text-beige p-4 rounded-xl placeholder-beige"
              />
            </div>
          </div>
        </div>

        {/* Buttons at the Bottom */}
        <div className="mt-auto flex justify-end gap-4 pt-6">
          <button>
            <img src={change_password} alt="Change Password" />
          </button>
          <button>
            <img src={save_changes} alt="Save Changes" />
          </button>
        </div>
      </div>
    </div>
  );
}
