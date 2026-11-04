import profilePhoto from '../../imports/1651352529991.jpg';

export default function ProfilePhoto() {
  return (
    <img
      src={profilePhoto}
      alt="Alfeus Xiesi Delroy"
      fetchPriority="high"
      data-hero-photo
      className="h-40 w-40 shrink-0 rounded-[32px] object-cover object-top md:h-72 md:w-60"
    />
  );
}
