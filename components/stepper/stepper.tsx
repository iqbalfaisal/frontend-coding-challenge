import { Step } from "./steps";

export interface StepperProps {
    currentStep: number,
    steps: Step[]
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function Stepper({ currentStep, steps }: StepperProps) {
    const renderStep = (step: Step, index: number) => {
        const isActive = index <= currentStep;
        const isLast = index === steps.length - 1;
		
        return <li key={index + step.title} className="flex-1 flex flex-shrink-0 flex-col items-center relative px-5">
            {!isLast && (
                <div className={`absolute top-1/2 left-1/2 w-full h-[4px] sm:h-[6px] transform -translate-y-2 sm:-translate-y-3 -z-10 
                            ${index < currentStep ? "bg-blue-500" : "bg-gray-200"}`}>
                </div>
            )}
            <div className={`size-[30px] sm:size-[40px] flex items-center mt-3 text-[12px] leading-[16px] sm:text-[14px] sm:leading-[20px] justify-center rounded-full 
                            ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`} >
                {index + 1}
            </div>
            <span className={`mt-2 truncate text-[12px] leading-[16px] sm:text-[16px] sm:leading-[24px] font-semibold justify-center items-center
                            ${index <= currentStep ? "text-gray-700" : "text-gray-500"}`}>
               {truncate(step.title, 10)}
            </span>
        </li>
    }

    return (
        <div
		    data-testid="stepper-container"
            className={
                "h-[100px] lg:justify-center lg:max-w-2xl content-center items-center overflow-x-auto"
            }
        >
            <ol className="flex relative justify-between">
                {steps.map(renderStep)}
            </ol>
        </div>
    );
}

