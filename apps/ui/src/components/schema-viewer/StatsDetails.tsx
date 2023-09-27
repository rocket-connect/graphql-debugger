import type { StatsDetailsProps } from "./types"
import classNames from 'classnames'
export const StatsDetails = ({statsType, statsDetails}: StatsDetailsProps) => { 
   return (
    <div className="flex items-center gap-1 ">
        <span>{statsType}:</span>
        <span className={classNames('font-bold', {
            ['text-red-500']: statsType === 'Error Count'
        })}>{statsDetails} {statsType === "Average Duration" && `ms`}</span>
    </div>
   )
}