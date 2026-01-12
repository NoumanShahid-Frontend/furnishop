import React from "react";

// import data
import { stats } from "../data";

const Stats = () => {
	return (
		<div className='bg-[var(--primary-color)] px-6 py-10 md:px-10 md:py-12 rounded-2xl'>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-y-10 text-center'>
				{stats.map((item, index) => (
					<div
						className='min-h-[70px] flex flex-col justify-center px-4 border-white/20 [&:nth-child(odd)]:border-r lg:border-r lg:last:border-none [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r [&:nth-child(4)]:border-r-0'
						key={index}
					>
						<div className='font-semibold text-2xl lg:text-4xl'>
							{item.value}
						</div>
						<div className='text-base font-light max-w-[160px] mx-auto lg:text-xl opacity-90'>
							{item.text}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Stats;
