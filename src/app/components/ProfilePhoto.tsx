import profilePhoto from '../../imports/1651352529991.webp';

export default function ProfilePhoto() {
  return (
    <img
      src={profilePhoto}
      alt="Alfeus Xiesi Delroy"
      fetchPriority="high"
      data-hero-photo
      className="h-40 w-40 shrink-0 rounded-[28px] object-cover object-top shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_24px_60px_-20px_rgba(0,0,0,0.8)] md:h-72 md:w-60"
    />
  );
}
