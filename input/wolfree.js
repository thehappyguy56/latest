// SPDX-License-Identifier: AGPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
'use strict'
const wolfree = {
	input:    new URLSearchParams(location.search).get`wolfree_input`    || '',
	i2d:      new URLSearchParams(location.search).get`wolfree_i2d`      || '',
	podstate: new URLSearchParams(location.search).get`wolfree_podstate` || '',
	makeObservable: t => {
		if (t.startWebSocket) {
			const startWebSocket = t.startWebSocket
			t.startWebSocket = e => {
				startWebSocket(e)
				if (t.current.value.length) {
					wolfree.input = t.current.value
					wolfree.i2d   = t.current.i2d ? 'true' : ''
				}
				setTimeout(wolfree.entrypoint)
			}
		}
	},
	entrypoint: async () => {
		setTimeout(
			() => {
				const windowURL = new URL(location)
				windowURL.searchParams.set('wolfree_input',    wolfree.input)
				windowURL.searchParams.set('wolfree_i2d',      wolfree.i2d)
				windowURL.searchParams.set('wolfree_podstate', wolfree.podstate)
				history.pushState(null, '', windowURL)
			}
		)
		setTimeout( // show the skeleton components
			() => document.querySelector`
				#__next > div > div._1MeJ._3eup > main > div._3BQG > div,
				#__next > div > div._1MeJ._3eup > main > div._1wzL > div,
				#__next > div > div._1MeJ._3eup > main > div._3VFW > div
			`.style.display = ''
		)
		setTimeout( // hide the results of previous calculations
			() => {
				const element = document.querySelector`[data-wolfree-pods]`
				if (element) element.style.display = 'none'
			}
		)
		const appIDArray = [
			'THL396-JGHRK9EVU6'
		]
		const appID = appIDArray[
			self.crypto.getRandomValues(new Uint32Array(1)) % appIDArray.length
		]
		const apiURL = new URL('https://api.wolframalpha.com/v2/query')
		apiURL.searchParams.append('output', 'json')
		apiURL.searchParams.append('scantimeout', 30)
		apiURL.searchParams.append('podtimeout', 30)
		apiURL.searchParams.append('formattimeout', 30)
		apiURL.searchParams.append('parsetimeout', 30)
		apiURL.searchParams.append('totaltimeout', 30)
		apiURL.searchParams.append('podstate', 'Step-by-step solution')
		apiURL.searchParams.append('podstate', 'Step-by-step')
		apiURL.searchParams.append('podstate', 'Show all steps')
		wolfree.input    && apiURL.searchParams.append('appid', appID)
		wolfree.input    && apiURL.searchParams.append('input', wolfree.input)
		wolfree.i2d      && apiURL.searchParams.append('i2d', wolfree.i2d)
		wolfree.podstate && apiURL.searchParams.append('podstate', wolfree.podstate)
		await jQuery.ajax(
			{
				url: apiURL,
				dataType: 'jsonp',
				success: response => document.querySelector`main`.insertAdjacentHTML(
					'afterend',
					`
						<div
							class=_3BQG
							style=padding:0
							data-wolfree-pods
						>
							<div class=_2ThP>
								<div class=_pA1m>
									<section class=_1vuO>
										${
											response.queryresult.pods?.map(
												pod => `
													<section class=_gtUC>
														${
															`
																<header class=_2Qm3>
																	<h2 class=_3OwK>
																		${pod.title}
																	</h2>
																	${
																		pod.states?.map(
																			state => state.states ? `
																				<select
																					style="
																						background: white;
																						border-radius: 4px;
																						color: orangered;
																						border: thin solid darkorange
																					"
																					onchange="
																						wolfree.podstate = this.value
																						setTimeout(wolfree.entrypoint)
																					"
																				>
																					<option>
																						${state.value}
																					</option>
																					${
																						state.states.map(
																							state => `
																								<option>
																									${state.name}
																								</option>
																							`
																						).join``
																					}
																				</select>
																			` : ''
																		).join('') || ''
																	}
																</header>
																<div class=_1brB> </div>
																${
																	pod.subpods.map(
																		subpod => `
																			<div class=_1brB>
																				<div class=_3fR4>
																					<img
																						class=_3c8e
																						style=width:auto
																						src=${subpod.img.src}
																					>
																				</div>
																			</div>
																			<div
																				class=_1brB
																				style="
																					font-family: monospace;
																					overflow: auto;
																				"
																			>
																				<div class=_3fR4>
																					<details>
																						<summary style=direction:rtl> </summary>
																						<div contenteditable>
																							<pre>${subpod.plaintext}</pre>
																						</div>
																						<br>
																					</details>
																				</div>
																			</div>
																		`
																	).join``
																}
															`
														}
													</section>
												`
											).join('') || ''
										}
										<section class=_gtUC>
											<header class=_2Qm3>
												<h2 class=_3OwK>
													Wolfree JavaScript variables
												</h2>
											</header>
											<div
												class=_1brB
												style="
													font-family: monospace;
													overflow: auto;
												"
											>
												<div class=_3fR4>
													<details open>
														<summary> </summary>
														<br>
														<div contenteditable>
															<pre>${JSON.stringify({wolfree, response}, null, 4)}</pre>
														</div>
														<br>
													</details>
												</div>
											</div>
										</section>
									</section>
								</div>
							</div>
						</div>
					`
				),
			}
		)
		setTimeout( // hide the skeleton components
			() => document.querySelector`
				#__next > div > div._1MeJ._3eup > main > div._3BQG > div,
				#__next > div > div._1MeJ._3eup > main > div._1wzL > div,
				#__next > div > div._1MeJ._3eup > main > div._3VFW > div
			`.style.display = 'none'
		)
	},
}
setInterval(
	() => {
		setTimeout( // insert the wolfree logo
			() => document.querySelector`[data-wolfree-logo]` || document.querySelector`body`.insertAdjacentHTML(
				'afterbegin',
				`
					<nav
						style="
								
								text-align: center;
								font-family: sans-serif;
								line-height: 3;
						"
						data-wolfree-logo
					>
						<a
							style="
								font-size: xx-large;
								text-decoration: none;
							"
							href=../index.html
						>
							WolfreeAlpha
						</a>
					</nav>
				`
			)
		)
		const hide = selector => setTimeout(
			() => {
				const element = document.querySelector(selector)
				if (element) element.style.display = 'none'
			}
		)
		hide`#__next > div > footer` // <a href="/pro">Pro</a>
		hide`#__next > div > header` // <span>UPGRADE TO PRO</span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > a > img,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > a > img
		` // <img alt="WolframAlpha computational knowledge AI">
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > div._P0Rq > ul > li:nth-child(2) > div,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > div._Lhw0 > ul > li:nth-child(2) > div
		` // <span>Use Math Input Mode to directly enter textbook math notation. </span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > div._3-sN > div > div,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > div._3-sN > div > div
		` // <span>Enter an image as an input to Wolfram|Alpha for analysis or processing.</span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._3BQG > div > div._2bfa,
			#__next > div > div._1MeJ._3eup > main > div._1wzL > div > div._2bfa,
			#__next > div > div._1MeJ._3eup > main > div._3VFW > div > div._3Fov
		` // <span>Have a question about using Wolfram|Alpha?</span>
	},
	100
)
window.addEventListener(
	'load',
	async () => { // focus on the orangish input box
		while (document.activeElement != document.querySelector`input`) {
			document.querySelector`input`.focus()
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
	}
)
