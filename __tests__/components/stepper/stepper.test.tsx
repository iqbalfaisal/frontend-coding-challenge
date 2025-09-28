import { render, screen, within } from "@testing-library/react";
import Stepper, { StepperProps } from "../../../components/stepper/stepper";
import { Step } from "../../../components/stepper/steps";

const makeSteps = (count: number): Step[] =>
	Array.from({ length: count }, (_, i) => ({ title: `Step ${i + 1}` }));

const buildProps = (override?: Partial<StepperProps>): StepperProps => {
	return {
		currentStep: 0,
		steps: makeSteps(3),
		...override
	}
}

describe("Stepper Component", () => {

	const setup = (props = buildProps()) => render(<Stepper {...props} />)

	it("renders all steps", async () => {
		setup(buildProps({ steps: makeSteps(4) }))
		const list = await screen.findByRole("list");
		const items = within(list).getAllByRole("listitem");

		expect(items).toHaveLength(4);

	});

	it("renders all step titles", async () => {
		const steps = makeSteps(3)
		setup(buildProps({ steps }))

		const list = await screen.findByRole("list");
		const items = within(list).getAllByRole("listitem");
		steps.forEach((step, index) => {
			expect(
				within(items[index]).queryByText(step.title)
			).toBeTruthy();
		});
	});

	it("should truncate the long title", async () => {
		setup(buildProps({ steps: [{ title: "It is a long string in stepper" }] }));

		const list = await screen.findByRole("list");
		const items = within(list).getAllByRole("listitem");

		const expected = "It is a lo…";

		expect(within(items[0]).getByText(expected)).toBeTruthy();
		expect(within(items[0]).queryByText("It is a long string in stepper")).toBeFalsy();
	});

	it("highlights the current step correctly", () => {
		setup(buildProps({ currentStep: 1 }))

		const activeStep = screen.getByText("Step 2");
		expect(activeStep.classList.contains("text-gray-700")).toBe(true);
	});

	it("applies active style for completed steps", () => {
		setup(buildProps({ currentStep: 2 }))

		const completedStep = screen.getByText("Step 1");
		expect(completedStep.classList.contains("text-gray-700")).toBe(true);
	});

	it("marks future steps as inactive", () => {
		setup(buildProps())

		const futureStep = screen.getByText("Step 3");
		expect(futureStep.classList.contains("text-gray-500")).toBe(true);
	});

	it("renders step numbers correctly", () => {
		const steps = makeSteps(3)
		setup(buildProps({ steps }))

		steps.forEach((_, index) => {
			expect(screen.getByText(index + 1)).toBeTruthy();
		});
	});

	it("renders connectors between steps", () => {
		const steps = makeSteps(3)
		setup(buildProps({ currentStep: 1, steps }))

		const connectors = screen.getAllByRole("listitem")
			.filter((item, idx) => idx < steps.length - 1)
			.map((item) => item.querySelector("div.absolute"));

		connectors.forEach((connector, idx) => {
			if (connector)
				if (idx < 1) {
					expect(connector.classList.contains("bg-blue-500")).toBe(true);

				} else {
					expect(connector.classList.contains("bg-gray-200")).toBe(true);
				}
		});
	});

	it("shows horizontal scrollbar if there are too many steps", () => {
		const steps = makeSteps(20);
		setup(buildProps({ steps }))

		const container = screen.getByTestId("stepper-container");

		Object.defineProperty(container, "scrollWidth", { configurable: true, value: 2000 });
		Object.defineProperty(container, "clientWidth", { configurable: true, value: 500 });

		expect(container.scrollWidth).toBeGreaterThan(container.clientWidth);
	});
});
