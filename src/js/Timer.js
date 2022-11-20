// essa classe pode ser utilizado para varias tarefas inclusive games, 
// como vc pode ver temos alguns atributos bem interessantes

// para usar ela crie uma instancia no arquivo principal e pronto.
// como os atributos são estáticos não e nescessario usar nemhuma instacia para utilizalos

export default class Timer 
{
    static Time = 0.0;
    static ElapsedTime = 0.0;
    static Frames = 0.0;

    static #then = 0.0;
    static #framecount = 0.0;
    static #previoustime = 0.0;

    constructor()
    {
        requestAnimationFrame(Timer.Update);
    }

    static Update(now) 
    {
        now *= 0.001;
        Timer.ElapsedTime = now - Timer.#then;
        Timer.#then = now;

        Timer.Time += Timer.ElapsedTime;
        
        Timer.#framecount++;
        if(Timer.Time - Timer.#previoustime >= 1.0)
        {
            Timer.Frames = Timer.#framecount;
            Timer.#framecount = 0;
            Timer.#previoustime = Timer.Time;
        }

        requestAnimationFrame(Timer.Update);
    }
}