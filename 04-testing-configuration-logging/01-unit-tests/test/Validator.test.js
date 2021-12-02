const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидирует строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });
      it('если строка короче минимальной длины, отдает ошибку', () => {
        const errors = validator.validate({name: 'four', surname: 'test', age: 10});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
      });

      it('если строка длиннее максимальной длины, отдает ошибку', () => {
        const errors = validator.validate({name: 'Lalalalalala', surname: 'test', age: 10});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 12');
      });

      it('если строка равна минимальной длине, не отдает ошибку', () => {
        const errors = validator.validate({name: 'lalal', surname: 'test', age: 10});

        expect(errors).to.have.length(0);
      });

      it('если строка равна максимальной длине, не отдает ошибку', () => {
        const errors = validator.validate({name: 'Lalalalala', surname: 'test', age: 10});

        expect(errors).to.have.length(0);
      });

      it('если "max > длина строки > min" , не отдает ошибку', () => {
        const errors = validator.validate({name: 'Lalalal', surname: 'test', age: 10});

        expect(errors).to.have.length(0);
      });

      it('если вместо строки передали массив, отдает ошибку', () => {
        const errors = validator.validate({name: ['La'], surname: 'test', age: 10});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got object');
      });

      it('если поле отсутствует, отдает ошибку', () => {
        const errors = validator.validate({surname: 'test'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got undefined');
      });
    });

    describe('валидирует числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 35,
        },
      });

      it('если число меньше минимального, отдает ошибку', () => {
        const errors = validator.validate({age: 17, name: 'lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        // eslint-disable-next-line max-len
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
      });

      it('если число больше максимального, отдает ошибку', () => {
        const errors = validator.validate({age: 40, name: 'lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 35, got 40');
      });

      it('если число равно минимальному, не отдает ошибку', () => {
        const errors = validator.validate({age: 18, name: 'lalala'});

        expect(errors).to.have.length(0);
      });

      it('если число равно максимальному, не отдает ошибку', () => {
        const errors = validator.validate({age: 35, name: 'lalala'});

        expect(errors).to.have.length(0);
      });

      it('если "max > число > min", не отдает ошибку', () => {
        const errors = validator.validate({age: 25, name: 'lalala'});

        expect(errors).to.have.length(0);
      });

      it('если вместо числа передали строку, отдает ошибку', () => {
        const errors = validator.validate({age: '20', name: 'lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('если поле отсутствует, отдает ошибку', () => {
        const errors = validator.validate({surname: 'test', name: 'lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got undefined');
      });
    });

    describe('валидирует объекты с разными полями', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 35,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });
      it('отдает ошибки для двух полей, если оба вне нижней границы', () => {
        const errors = validator.validate({age: 17, name: 'lala'});

        expect(errors).to.have.length(2);
        errors.forEach((error) => {
          expect(error).to.have.property('field').and.to.be.oneOf(['age', 'name']);
          expect(error).to.have.property('error').and.to.be.oneOf([
            'too little, expect 18, got 17',
            'too short, expect 5, got 4',
          ]);
        });
      });

      describe('отдает ошибки для двух полей, если', () => {
        it('нет поля "age"', () => {
          const errors = validator.validate({name: 'lala'});

          expect(errors).to.have.length(2);
          errors.forEach((error) => {
            expect(error).to.have.property('field').and.to.be.oneOf(['age', 'name']);
            expect(error).to.have.property('error').and.to.be.oneOf([
              'expect number, got undefined',
              'too short, expect 5, got 4',
            ]);
          });
        });

        it('нет поля "name"', () => {
          const errors = validator.validate({age: 17});

          expect(errors).to.have.length(2);
          errors.forEach((error) => {
            expect(error).to.have.property('field').and.to.be.oneOf(['age', 'name']);
            expect(error).to.have.property('error').and.to.be.oneOf([
              'expect string, got undefined',
              'too little, expect 18, got 17',
            ]);
          });
        });

        it('нет поля "name" и поля "age"', () => {
          const errors = validator.validate({});

          expect(errors).to.have.length(2);
          errors.forEach((error) => {
            expect(error).to.have.property('field').and.to.be.oneOf(['age', 'name']);
            expect(error).to.have.property('error').and.to.be.oneOf([
              'expect string, got undefined',
              'expect number, got undefined',
            ]);
          });
        });
      });
    });

    describe('отдает ошибку если передан не объект, a', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 35,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });
      it('undefined', () => {
        const errors = validator.validate();
        expect(errors).to.have.length(1);
        // eslint-disable-next-line max-len
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect undefined is object, got undefined');
      });
      it('null', () => {
        const errors = validator.validate(null);
        expect(errors).to.have.length(1);
        // eslint-disable-next-line max-len
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect null is object, got null');
      });
      it('строка', () => {
        const errors = validator.validate('lalala');
        expect(errors).to.have.length(1);
        // eslint-disable-next-line max-len
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect lalala is object, got string');
      });
      it('массив', () => {
        const errors = validator.validate([{name: 'lala', age: 15}]);
        expect(errors).to.have.length(1);
        // eslint-disable-next-line max-len
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect ${JSON.stringify([{name: 'lala', age: 15}])} is object, got Array`);
      });
    });

    describe('валидирует корректно, если', () => {
      it('не передан max', () => {
        const validator = new Validator({age: {
          type: 'number',
          min: 18,
        },
        name: {
          type: 'string',
          min: 5,
        }});

        // eslint-disable-next-line max-len
        const errors = validator.validate({age: Infinity, name: 'asdfasdfasdfasdfasdfkhasfd asdkfh asdfaksd hhs dkhasdf kashdf;kahsd;fkah; sdfha;h;asdhf;ashd f'});
        expect(errors).to.have.length(0);
      });

      it('не передан min', () => {
        const validator = new Validator({age: {
          type: 'number',
          max: 18,
        },
        name: {
          type: 'string',
          max: 5,
        }});

        // eslint-disable-next-line max-len
        const errors = validator.validate({age: -Infinity, name: ''});
        expect(errors).to.have.length(0);
      });
    });
  });
});
