import { Question, QuestionSet } from "nest-commander";

@QuestionSet({ name: 'ensure-production-question' })
export class EnsuerProductionQuestion {
  @Question({
    message: 'El comando se va a ejecutar en producción. Estás seguro?',
    name: 'production',
    type: 'confirm',
    default: false,
  })
  parseTask(val) {
    return val.production;
  }
}
