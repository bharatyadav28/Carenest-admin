interface Props {
  className?: string;
}

function NoItems({ className }: Props) {
  const classes = `flex flex-col gap-2 items-center text-[var(--blue-gray}] ${className}`;

  return (
    <div className={classes}>
      <img src={"/no-items.png"} alt="Logo" width={120} height={100} />
      <div className="font-medium">You have not received any messages.</div>
    </div>
  );
}

export default NoItems;
