var gamestate = "title"
var gamestates = []
var title = true

function changeState(state, isTitle, ...args)
{
	if(gamestates[state])
	{
		gamestate = state;
		gamestates[state].changedTo(...args);
		jsDoom.wipe.startWiping();
		console.log("Switching to state \"" + state + "\"");
		title = isTitle;
	}
}
