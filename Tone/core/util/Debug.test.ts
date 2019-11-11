import { expect } from "chai";
import { ToneOscillatorNode } from "../../source/oscillator/ToneOscillatorNode";
import { assertRange, setLogger } from "./Debug";
import { theWindow } from "../context/AudioContext";
import { GrainPlayer, Oscillator } from "Tone/source";

describe("Debug", () => {

	it("can log a class when that class is set to 'debug'", () => {
		const osc = new ToneOscillatorNode();
		osc.debug = true;
		let loggerInvoked = false;
		let warnInvoked = false;
		setLogger({
			log: () => loggerInvoked = true,
			warn: () => warnInvoked = true
		});
		osc.start();
		expect(loggerInvoked).to.be.true;
		expect(warnInvoked).to.be.false;
		osc.dispose();
		setLogger(console);
	});

	it("can log a class when the window is set with that class name", () => {
		// @ts-ignore
		theWindow.TONE_DEBUG_CLASS = "ToneOscillatorNode";
		const osc = new ToneOscillatorNode();
		let loggerInvoked = false;
		let warnInvoked = false;
		setLogger({
			log: () => loggerInvoked = true,
			warn: () => warnInvoked = true
		});
		osc.start();
		expect(loggerInvoked).to.be.true;
		expect(warnInvoked).to.be.false;
		setLogger(console);
		// @ts-ignore
		theWindow.TONE_DEBUG_CLASS = undefined;
		osc.dispose();
	});

	it("can assert a range", () => {
		expect(() => {
			assertRange(-1, 0, 1);
		}).to.throw(RangeError);

		expect(() => {
			assertRange(2, 0, 1);
		}).to.throw(RangeError);
		
		expect(() => {
			assertRange(0, 0);
		}).to.not.throw(RangeError);
	});

	it("warns if console is not running", async () => {
		const ac = new AudioContext();
		await ac.suspend();
		const osc = new GrainPlayer();
		osc.debug = true;
		let warnInvoked = false;
		setLogger({
			log: () => {},
			warn: () => warnInvoked = true
		});
		osc.start();
		expect(warnInvoked).to.be.false;
		osc.dispose();
		setLogger(console);
		await ac.close();
	});
});
