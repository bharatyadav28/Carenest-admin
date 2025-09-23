interface Props {
  url: string;
  alt: string;
  className?: string;
}

function DP({ url, alt, className }: Props) {
  const classes = `relative rounded-full flex w-12 h-12 ${className}`;
  return (
    <div className={classes}>
      <img src={url} alt={alt} className="rounded-full" />
    </div>
  );
}

export default DP;
