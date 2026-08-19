import { useState } from "react";
import { followUser, unfollowUser } from "../api/users";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function FollowButton({
  username,
  initiallyFollowed,
}: {
  username: string;
  initiallyFollowed: boolean;
}) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(initiallyFollowed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.username === username) return null;

  const toggle = async () => {
    setBusy(true);
    setError("");
    try {
      if (following) {
        await unfollowUser(username);
        setFollowing(false);
      } else {
        await followUser(username);
        setFollowing(true);
      }
    } catch (err) {
      // Follow/unfollow can legitimately fail (e.g. state already changed in
      // another tab, session expired) - surface it instead of the button
      // silently doing nothing, which is what made this look "broken".
      setError(getErrorMessage(err, "Couldn't update follow status"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={busy}
        className="rounded-md border px-4 py-1.5 text-sm font-medium transition disabled:opacity-50"
        style={
          following
            ? { borderColor: "var(--border-subtle)", color: "var(--brand-text)", backgroundColor: "transparent" }
            : { borderColor: "var(--brand-primary)", backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }
        }
      >
        {following ? "Following" : "Follow"}
      </button>
      {error && (
        <p className="absolute left-0 top-full mt-1.5 w-max max-w-[220px] text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
