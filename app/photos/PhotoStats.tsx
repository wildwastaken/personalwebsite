interface PhotoStatsProps {
  photoCount: number
}

export default function PhotoStats({ photoCount }: PhotoStatsProps) {
  return (
    <div className="border-t border-[#E6E4D9] dark:border-[#282726] pt-5 mt-12 flex flex-wrap items-center justify-between font-mono text-xs text-[#6F6E69] dark:text-[#878580]">
      <div>
        {photoCount} photos
      </div>
      <div>
        Peru · Canada · Iceland · US
      </div>
    </div>
  )
}
