import JobBadge from '@/features/guild/components/job-badge'

import { MgfCharacterDto } from '../../types/character-compare.type'
import PredictMemberPortrait from '../guild-rank-predict/predict-member-portrait'

type CharacterSummaryCardProps = {
	role: '나' | '상대방'
	character: MgfCharacterDto
}

function CharacterSummaryCard({ role, character }: CharacterSummaryCardProps) {
	const { guildName, job, name, portraitUrl, serverLabel } = character

	return (
		<div className="border-grayscale-200 bg-card shadow-soft w-full min-w-0 rounded-xl border p-3 text-center md:p-4">
			<p className="text-grayscale-500 text-[11px] md:text-xs">{role}</p>
			<div className="mt-1.5 flex justify-center">
				<PredictMemberPortrait name={name} src={portraitUrl} className="size-14 md:size-16" />
			</div>
			<div className="mt-1.5 flex flex-col items-center gap-1">
				<p className="text-grayscale-900 truncate text-base font-semibold md:text-xl">{name}</p>
				<JobBadge job={job} />
				<p className="text-grayscale-500 text-[11px] md:text-sm">{serverLabel}</p>
				<p className="text-grayscale-500 text-[11px] md:text-sm">
					소속 길드: <span className="font-semibold">{guildName ?? '없음'}</span>
				</p>
			</div>
		</div>
	)
}

export default CharacterSummaryCard
